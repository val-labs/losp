call: clean all
all: l2
#all: losp
losp: ; ./losp.ros
l2: ; ./l2.lisp
svr: ; python3 -um svr
clean:
	rm -fr __pycache__
	find . -name '*~' | xargs rm
	tree .
