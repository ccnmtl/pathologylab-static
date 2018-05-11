VE ?= ./ve
FLAKE8 ?= $(VE)/bin/flake8
REQUIREMENTS ?= requirements.txt
SYS_PYTHON ?= python3
ENV_PYTHON ?= $(VE)/bin/python
PIP ?= $(VE)/bin/pip
PY_SENTINAL ?= $(VE)/sentinal
WHEEL_VERSION ?= 0.29.0
VIRTUALENV ?= virtualenv.py
SUPPORT_DIR ?= requirements/virtualenv_support/
SCRIPT_FILE ?= convert.py
MAX_COMPLEXITY ?= 10
PY_DIRS ?= *.py tests --exclude virtualenv.py

STAGING_URL=https://pathologylab.stage.ctl.columbia.edu/
PROD_URL=https://pathologylab.ctl.columbia.edu/
STAGING_BUCKET=pathologylab.stage.ctl.columbia.edu
PROD_BUCKET=pathologylab.ctl.columbia.edu

JS_FILES=themes/ctl-pathologylab/static/js/src

all: eslint

include *.mk

$(PY_SENTINAL): $(REQUIREMENTS) $(VIRTUALENV) $(SUPPORT_DIR)* 
	rm -rf $(VE)
	$(SYS_PYTHON) $(VIRTUALENV) --extra-search-dir=$(SUPPORT_DIR) --never-download $(VE)
	$(PIP) install wheel==$(WHEEL_VERSION)
	$(PIP) install --use-wheel --requirement $(REQUIREMENTS)
	$(SYS_PYTHON) $(VIRTUALENV) --relocatable $(VE)
	touch $@

flake8: $(PY_SENTINAL)
	$(FLAKE8) $(PY_DIRS) --max-complexity=$(MAX_COMPLEXITY)

build-scss: $(JS_SENTINAL)
	npm run build-scss

clean:
	rm -rf ve

.PHONY: clean
