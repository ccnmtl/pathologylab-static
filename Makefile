#STAGING_URL=https://pathologylab-static.stage.ctl.columbia.edu/
#PROD_URL=https://pathologylab.ctl.columbia.edu/
#STAGING_BUCKET=pathologylab-static.stage.ctl.columbia.edu
#PROD_BUCKET=pathologylab.ctl.columbia.edu
INTERMEDIATE_STEPS ?= make $(PUBLIC)/js/all.json

JS_FILES=themes/ctl-pathologylabs/static/js/

all: eslint

include *.mk

$(PUBLIC)/js/all.json: $(PUBLIC)/json/all/index.html
	mv $< $@ \
	&& ./checkjson.py
