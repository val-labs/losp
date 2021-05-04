call: clean all
all: lnb
lnb:  ; roswell/lnb.ros 8888
svr:  ; python3 -um svr
clean:
	rm -fr __pycache__
	find . -name '*~' | xargs rm
	tree .
