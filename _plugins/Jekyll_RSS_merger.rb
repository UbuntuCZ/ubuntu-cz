module Jekyll_RSS_merger

  class FeedMerger
    def self.merge(site)
      feeds = site.data['rss_feeds'] # from Jekyll_Get_Remote_Content
      if !feeds
        return
      end
      config = site.config['merge_rss']

      config.each do |to_merge|
        all_items = []
        to_merge['feeds'].each do |feed_name|
          all_items = all_items + feeds[feed_name]['items']
        end
        feeds[to_merge['key']] = { 'name'=>to_merge['key'], 'title'=>to_merge['title'], 'items'=>all_items.sort_by { |it| it['published'] }.reverse }
      end
    end
  end

end
