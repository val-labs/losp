call: clean all
all: lnb
lnb:  ; ./lnb.lisp 8888
svr:  ; python3 -um svr
clean:
	rm -fr __pycache__
	find . -name '*~' | xargs rm
	tree .
