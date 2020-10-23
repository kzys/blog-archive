require 'open-uri'
require 'json'
require 'date'

def load_posts(url, lang)
  JSON.parse(URI.open(url).read)['items'].map do |x|
    x.merge({
              'lang' => lang,
              'published' => Date.parse(x['published']),
            })
  end
end

posts = load_posts('https://blog.8-p.info/en/index.json', 'en') + load_posts('https://blog.8-p.info/ja/index.json', 'ja')

posts = posts.sort do |a, b| a['published'] <=> b['published'] end.reverse


by_year_month = {}

posts.each do |x|
  published = x['published']
  by_year_month[published.year] ||= {}
  by_year_month[published.year][published.month] ||= []
  by_year_month[published.year][published.month] += [x.merge({'published' => published })]
end

to_hugo = by_year_month.keys.sort.reverse.map do |year|
  per_year = {
    year: year,
    months: []
  }

  by_year_month[year].keys.sort.reverse.each do |month|
    month_name = by_year_month[year][month][0]['published'].strftime('%B')

    per_year[:months] += [
      {
        'Month' => month,
        'MonthName' => month_name,
        'Items' => by_year_month[year][month].sort do |a, b| a['published'] <=> b['published'] end.reverse
      }
    ]
  end
  per_year
end

to_hugo = to_hugo[0...3]

puts JSON.generate(to_hugo)
