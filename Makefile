call: clean all
all: losp
losp: ; ./losp.ros
svr: ; python3 -um svr
clean:
	rm -fr __pycache__
	find . -name '*~' | xargs rm
	tree .
