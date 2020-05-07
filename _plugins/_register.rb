Jekyll::Hooks.register :site, :post_read do |site|
  Jekyll_Get_Remote_Content::FeedFetcher.fetchFor(site)
  Jekyll_RSS_merger::FeedMerger.merge(site)
end
