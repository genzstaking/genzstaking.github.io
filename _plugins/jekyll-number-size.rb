module Jekyll
  module NumberSize
    def formatprice(input)
	{
		' '  => 1000,
		'K'  => 1000 * 1000,
		'M'  => 1000 * 1000 * 1000,
		'B'  => 1000 * 1000 * 1000 * 1000,
		'T'  => 1000 * 1000 * 1000 * 1000 * 1000
	}.each_pair { |e, s| return "#{( input / (s / 1000)).round(2)}#{ e}" if input < s }
    end
  end
end

Liquid::Template.register_filter(Jekyll::NumberSize)
