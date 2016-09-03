# -*- coding: utf-8 -*-
require 'find'
require 'date'
require 'erb'
require 'fileutils'

class Article
  include Comparable

  def initialize(path)
    @path = path
    @published_at = fetch_published_at
    @title = fetch_title
  end
  attr_reader :path
  attr_reader :published_at
  attr_reader :title

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
end

html_dir = File.absolute_path(ARGV.shift)
views_dir = File.absolute_path(File.join(Dir.pwd, 'views'))

Dir.chdir(html_dir) do
  template = ERB.new(File.read(File.join(views_dir, 'previous.html.erb')))
  articles = Dir.glob('*/**/*').select do |f|
    basename = File.basename(f)
    File.file?(f) and f !~ %r{/(page|tag)/} and (basename != 'index.html') and (basename =~ /\.html$/ or basename !~ /\./) and File.read(f) !~ /<rss/
  end.map do |f|
    Article.new(f)
  end.sort do |a, b|
    a.published_at <=> b.published_at
  end

  years = {}

  articles.each do |article|
    years[article.published_at.year] ||= {}
    years[article.published_at.year][article.published_at.month] ||= []
    years[article.published_at.year][article.published_at.month].push(article)
  end

  html = template.result(binding)

  File.open('index.html', 'w') do |f|
    f.write(html)
  end

  FileUtils.mkdir_p('2005-2011')
  File.open('2005-2011/index.html', 'w') do |f|
    f.write(html)
  end
end

Dir.chdir(html_dir) do
  template = ERB.new(File.read(File.join(views_dir, 'index.html.erb')))
  html = template.result(binding)
  File.open('index.html', 'w') do |f|
    f.write(html)
  end
end
