#|-*- mode:lisp -*-
exec ros -Q -- $0 "$@" # |#
(progn ;;init forms
  (ros:ensure-asdf)
  #+quicklisp
  (eval-when (:compile-toplevel :load-toplevel :execute)
    (ql:quickload '(:hunchensocket :parenscript) :silent t))
  (push :hunchentoot-no-ssl *features*))

(defpackage :losp-chat2
  (:use :cl :parenscript :hunchentoot :hunchensocket))
(in-package :losp-chat2)

(defvar *chat-rooms* (list (make-instance 'websocket-resource)))

(defun find-room (request)
  (declare (ignore request))
  (car *chat-rooms*))

(pushnew 'find-room *websocket-dispatch-table*)

(defun broadcast (room message &rest args)
  (loop for peer in (clients room)
        do (send-text-message peer (apply #'format nil message args))))

(defmethod text-message-received ((room websocket-resource) user message)
  (format t "000:[~s]~%" (elt message 0))
  (let ((ch (elt message 0)))
    (cond ((eql ch #\*)
	   (format t "PING~%")
	   (send-text-message user "*"))
	  ((eql ch #\.)
	   (let ((msg (subseq message 1)))
	     (format t "PS0:[~s]~%" msg)
	     (let ((expr (read-from-string msg)))
	       (format t "PS1:[~s]~%" expr)
	       (let ((rslt (ps* expr)))
		 (format t "PS2:[~s]~%" rslt)
		 (broadcast room (concatenate
				  'string "." rslt))))))
	  (t
	   (let ((expr (read-from-string message)))
	     (format t "SV0:[~s]~%" expr)
	     (let ((rslt (write-to-string (eval expr))))
	       (format t "SV1:[~s]~%" rslt)
	       (broadcast room (concatenate
				'string "," rslt))))))))

(define-easy-handler (css :uri "/s.css") ()
  (setf (content-type*) "text/css")
  (uiop:read-file-string "www/s.css"))

(define-easy-handler (bongo-html :uri "/") ()
  (uiop:read-file-string "www/index.html"))

(defclass websocket-easy-acceptor (websocket-acceptor easy-acceptor) ()
  (:documentation "Special WebSocket easy acceptor"))

(defvar *default-port* 1234)
(defvar *server-port* nil)
(defvar *server* nil)

(defun main (&rest argv)
  (declare (ignorable argv))
  (setf *server* (make-instance 'websocket-easy-acceptor
				:port *default-port*))
  (start *server*)
  (let ((url (format nil "http://localhost:~s/" *default-port*)))
    (format t "listening... - go to ~s~%" url)
    (uiop:run-program (list "open" url))
    (loop (sleep 60))))
