
z:
	./losp.ros

call: clean all
all:
	python3 -um svr
clean:
	rm -fr __pycache__
	find . -name '*~' | xargs rm
