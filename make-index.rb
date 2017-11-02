# -*- coding: utf-8 -*-
require 'find'
require 'date'
require 'fileutils'
require 'json'
require 'cgi'

class Article
  include Comparable

  def initialize(path)
    @path = path
    @published_at = fetch_published_at
    @title = fetch_title
    @language = fetch_language
  end
  attr_reader :path
  attr_reader :published_at
  attr_reader :title, :language

  def <=>(other)
    self.published_at <=> other.published_at
  end

  def fetch_title
    title = if @path =~ %r{2008/}
              fetch_first_paragraph
            else
              fetch_title_element
            end

    title
      .gsub(/ - blog\.8-p\.info$/, '')
      .gsub(/^blog\.8-p\.info: /, '')
      .gsub(/ - Kato Kazuyoshi$/, '')
  end

  def fetch_first_paragraph
    content = File.read(@path).encode('UTF-8', invalid: :replace, replace: '?')
    if content =~ %r{<p>(.*)</p>}m
      $1.gsub(/<.*?>/, ' ').gsub(/^[\n]+/, '').split(/[。、!\n]/)[0].strip
    else
      nil
    end
  end

  def fetch_title_element
    content = File.read(@path).encode('UTF-8', invalid: :replace, replace: '?')
    if content =~ %r{<title>(.*)</title>}
      $1
    else
      nil
    end
  end

  def fetch_published_at
    if @path =~ %r{/(\d{4})/(\d+)/(\d+)/} # articles/ and 2011/
      Date.new($1.to_i, $2.to_i, $3.to_i)
    else
      content = File.read(@path).encode('UTF-8', invalid: :replace, replace: '?')
      if content =~ %r{(\d{4})-(\d+)-(\d+)}
        Date.new($1.to_i, $2.to_i, $3.to_i)
      elsif content =~ %r{(\d{4})/(\d+)/(\d+)}
        Date.new($1.to_i, $2.to_i, $3.to_i)
      else
        raise @path
      end
    end
  end

  def fetch_language
    content = File.read(@path).encode('UTF-8', invalid: :replace, replace: '?')
    if content =~ />lang-en</
      'en'
    elsif @published_at.year == 2011
      'en'
    else
      'ja'
    end
  end
end

html_dir = File.absolute_path(ARGV.shift)
views_dir = File.absolute_path(File.join(Dir.pwd, 'views'))

Dir.chdir(html_dir) do
  articles = Dir.glob('*/**/*').select do |f|
    basename = File.basename(f)
    File.file?(f) and f !~ %r{/(page|tag)/} and (basename != 'index.html') and (basename =~ /\.html$/ or basename !~ /\./) and File.read(f) !~ /<rss/
  end.map do |f|
    Article.new(f)
  end.sort do |a, b|
    a.published_at <=> b.published_at
  end

  first_year = articles[0].published_at.year
  last_year = articles[-1].published_at.year

  (first_year..last_year).each do |year|
    File.open("#{year}.json", 'w') do |f|
      items = articles.select do |a|
        a.published_at.year == year
      end.map do |a|
        {
            :published => a.published_at.to_time,
            :title => CGI.unescapeHTML(a.title),
            :url => "http://blog.8-p.info/#{a.path}",
            :language => a.language
        }
      end
      f.write(JSON.generate({ :items => items }))
    end
  end
end
