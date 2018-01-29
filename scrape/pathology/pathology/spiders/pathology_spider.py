import scrapy
from scrapy.linkextractors import LinkExtractor
from w3lib.html import remove_tags
import re
import os
import unicodedata
import datetime


def slugify(value):
    """
    Convert to ASCII. Convert spaces to hyphens.
    Remove characters that aren't alphanumerics, underscores, or hyphens.
    Convert to lowercase. Also strip leading and trailing whitespace.

    Borrowed from Django:
    https://github.com/django/django/blob/master/django/utils/text.py#L403
    """
    value = str(value)
    value = unicodedata.normalize('NFKD', value)\
        .encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)


class PathologySpider(scrapy.Spider):
    name = "pathology"
    extractor = LinkExtractor(allow_domains='pathologylab.ccnmtl.columbia.edu')
    match_lab_topic = re.compile('/lab\d{2}/$')
    match_lab_activity = re.compile('/lab\d{2}/\w*.html$')
    match_hist_technique = re.compile('/histological_techniques/\w*.html$')
    match_asset = re.compile('/assets_c/')

    def start_requests(self):
        urls = [
            'http://pathologylab.ccnmtl.columbia.edu/'
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        if (self.match_lab_topic.search(response.url)):
            self.render_lab_topic(response)
        elif (self.match_lab_activity.search(response.url)):
            self.render_lab_activity(response)
        elif (self.match_hist_technique.search(response.url)):
            self.render_hist_technique(response)
        elif (self.match_asset.search(response.url)):
            self.render_asset(response)
        else:
            self.render_page(response)

        links = self.extractor.extract_links(response)
        for link in links:
            yield response.follow(link)

    def render_lab_topic(self, response):
        # Filter for labXX
        lab_topic = [t for t in response.url.split('/')
                     if re.search(r'lab\d{2}', t)]
        lab_topic_number = int(re.search(r'\d{2}', lab_topic[0]).group(0))
        path = 'content/'
        filename = 'lab{:02d}'.format(lab_topic_number)

        title = remove_tags(response.css('.entrytitle').extract_first())
        with open(self.get_file_name(path, filename), 'w') as f:
            f.write('---\n')
            f.write('title: "{}"\n'.format(title))
            f.write('date: {}\n'.format(datetime.date.today().isoformat()))
            f.write('type: lab_topic\n')
            f.write('lab_topic_number: {}\n'.format(lab_topic_number))
            f.write('weight: \n')
            f.write('---\n')
            f.write(response.css('.entrybody').extract_first(default=''))

    def render_lab_activity(self, response):
        title = remove_tags(response.css('.entrytitle').extract_first(
                                            default='lab_activity'))

        lab_topic = response.url.split('/')[-2]
        lab_topic_number = int(re.search(r'\d{2}', lab_topic).group(0))

        path = 'content/lab{:02d}/'.format(lab_topic_number)
        with open(self.get_file_name(path, title), 'w') as f:
            f.write('---\n')
            f.write('title: "{}"\n'.format(title))
            f.write('date: {}\n'.format(datetime.date.today().isoformat()))
            f.write('type: lab_activity\n')
            f.write('lab_topic_number: {}\n'.format(lab_topic_number))
            f.write('lab_topic_name: "lab{:02d}"\n'.format(lab_topic_number))
            f.write('weight: \n')
            f.write('---\n')
            f.write(response.css('.entrybody').extract_first(default=''))

    def render_hist_technique(self, response):
        title = remove_tags(response.css('.entrytitle').extract_first(
                                            default='hist_technique'))
        path = 'content/histological_techniques/'

        with open(self.get_file_name(path, title), 'w') as f:
            f.write('---\n')
            f.write('title: "{}"\n'.format(title))
            f.write('date: {}\n'.format(datetime.date.today().isoformat()))
            f.write('type: histology_technique\n')
            f.write('weight: \n')
            f.write('---\n')
            f.write(response.css('.entrybody').extract_first(default=''))

    def render_page(self, response):
        title = remove_tags(response.css('.entrytitle').extract_first(
                                            default=''))
        if (title == ''):
            title = remove_tags(response.css('.pagetitle').extract_first(
                                              default='page'))
        path = 'content/'

        with open(self.get_file_name(path, title), 'w') as f:
            f.write('---\n')
            f.write('title: {}\n'.format(title))
            f.write('date: {}\n'.format(datetime.date.today().isoformat()))
            f.write('type: page\n')
            f.write('---\n')
            f.write(response.css('.pagecontentbody')
                    .extract_first(default=response.url))

    def render_asset(self, response):
        # get the last part of the path and use as title
        title = response.url.split('/')[-1][:-5]
        path = 'content/' + '/'.join(response.url.split('/')[3:-1])
        with open(self.get_file_name(path, title), 'w') as f:
            f.write('---\n')
            f.write('title: {}\n'.format(title))
            f.write('date: {}\n'.format(datetime.date.today().isoformat()))
            f.write('type: asset\n')
            f.write('---\n')
            f.write(response.css('img')
                    .extract_first(default=response.url))

    def get_file_name(self, path, title):
        if not os.path.exists(path):
            os.makedirs(path)

        filename = os.path.join(path, slugify(title) + '.md')
        i = 1
        while os.path.exists(filename):
            filename = os.path.join(path, slugify(title) + '_' + str(i) + '.md')
            i += 1

        return filename
