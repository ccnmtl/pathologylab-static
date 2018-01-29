scrape: $(PY_SENTINAL)
	rm -rf scrape/pathology/content/
	cd scrape/pathology \
	&& ../../$(VE)/bin/scrapy crawl pathology

scrape-replace: $(PY_SENTINAL)
	rm -rf content && cp -r scrape/pathology/content .

.PHONY: scrape scrape-replace
