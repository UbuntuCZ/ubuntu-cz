require 'open-uri'
require 'open_uri_redirections'

module Jekyll_Get_Remote_Content

  class Fetcher
    def self.fetchFor(site)
      config = site.config['remote_content']
      if !config
        return
      end
      if !config.kind_of?(Array)
        config = [config]
      end
      Dir.mkdir('remote_content') unless Dir.exist?('remote_content')
      config.each do |remote|
        open(remote['url'], 'r', :allow_redirections => :all) do |remote_content|
          open('remote_content/'+remote['name'], 'wb') do |local_file|
            local_file.write(remote_content.read)
          end
        end
      end
    end
  end

  Jekyll::Hooks.register :site, :after_reset do |site|
    Fetcher.fetchFor(site)
  end

end
