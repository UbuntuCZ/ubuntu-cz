require 'open-uri'
require 'open_uri_redirections'
require 'json'

module Jekyll_Ubuntu_Releases

  class Fetcher
    def self.fetchFor(site)
      site.data['ubuntu_releases'] = Hash.new
      site.data['ubuntu_releases']['all'] = get_all_releases()

      site.data['ubuntu_releases']['latest'] = Hash.new
      site.data['ubuntu_releases']['latest']['release'] = Hash.new
      site.data['ubuntu_releases']['latest']['lts'] = Hash.new
      site.data['ubuntu_releases']['all'].each do |release|
        if release['active_and_supported'] then
          if !release['lts'] then
            site.data['ubuntu_releases']['latest']['release'] = release
          else
            site.data['ubuntu_releases']['latest']['lts'] = release
          end
        end
      end

      release_version = get_precise_version(site.data['ubuntu_releases']['latest']['release']['version'])
      lts_version = get_precise_version(site.data['ubuntu_releases']['latest']['lts']['version'])
      site.data['ubuntu_releases']['latest']['release']['version'] = release_version
      site.data['ubuntu_releases']['latest']['lts']['version'] = lts_version
    end

    def self.get_all_releases()
      all_releases_data = []
      series = nil
      open('https://api.launchpad.net/devel/ubuntu/series', 'r', :allow_redirections => :all) do |series_content|
        series = JSON.parse(series_content.read)
      end
      cloud_images = nil
      open('https://cloud-images.ubuntu.com/releases/streams/v1/com.ubuntu.cloud:released:download.json', 'r', :allow_redirections => :all) do |cloud_images_content|
        cloud_images = JSON.parse(cloud_images_content.read)
      end
      (series['total_size'].to_i-1).downto(0).each do |i|
        series_entry = series['entries'][i]
        release_version = series_entry['version']
        cloud_images_entry = cloud_images['products']["com.ubuntu.cloud:server:#{release_version}:arm64"]
        release_data = Hash.new
        release_data['version'] = release_version
        release_data['name'] = series_entry['title'].delete_prefix('The ')
        release_data['lts'] = !cloud_images_entry.nil? ? cloud_images_entry['release_title'].downcase.include?('lts') : false
        release_data['released'] = series_entry['datereleased']
        release_data['eol'] = !cloud_images_entry.nil? ? cloud_images_entry['support_eol'] : nil
        release_data['active_and_supported'] = series_entry['active'] && series_entry['supported']
        all_releases_data.push(release_data)
      end
      return all_releases_data
    end

    def self.get_precise_version(base_version)
      url = 'http://releases.ubuntu.cz/'+base_version+'/SHA256SUMS'
      open(url, 'r', :allow_redirections => :all) do |remote_content|
        return /[0-9]+\.[0-9]+(\.[0-9])?/.match(remote_content.read).to_s
      end
    end
  end

  Jekyll::Hooks.register :site, :post_read do |site|
    Fetcher.fetchFor(site)
  end

end
