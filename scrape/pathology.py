# -*- coding: utf-8 -*-
import scrapy


class PathologySpider(scrapy.Spider):
    name = 'pathology'
    allowed_domains = ['pathologylab.ccnmtl.columbia.edu']
    start_urls = ['http://pathologylab.ccnmtl.columbia.edu/']

    def parse(self, response):
        pass
