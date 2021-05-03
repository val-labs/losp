#|-*- mode:lisp -*-
exec ros +Q -- $0 "$@" # |#
(progn ;;init forms
  (ros:ensure-asdf)
  #-quicklisp
  (eval-when (:compile-toplevel :load-toplevel :execute)
    (let ((*error-output* (make-string-output-stream)))
      (require 'parenscript)
      (require 'hunchensocket)
      ))
  #+quicklisp
  (eval-when (:compile-toplevel :load-toplevel :execute)
    (ql:quickload '(:hunchensocket :parenscript) :silent t))
  (push :hunchentoot-no-ssl *features*))

(defpackage :lnb (:nicknames :lisp-notebook)
	    (:use :cl :parenscript :hunchentoot :hunchensocket))
(in-package :lnb)

;; macros

(defmacro concat (&rest rest)
  `(concatenate 'string ,@rest))

;; variables

(defvar *chat-room* (make-instance 'websocket-resource))

(defvar *default-port* 1234)
(defvar *server-port* nil)
(defvar *server-url* nil)
(defvar *server* nil)

(pushnew (lambda (r) (declare (ignore r)) *chat-room*)
	 *websocket-dispatch-table*)

(defun broadcast (room message &rest args)
  (loop for peer in (clients room)
        do (send-text-message peer (apply #'format nil message args))))

(defmethod text-message-received ((room websocket-resource) user message)
  (format t "000:[~s]~%" message)
  (format t "001:[~a]~%" message)
  t)
  #|
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
				'string "," rslt))))))))|#

(define-easy-handler (bongo-html :uri "/") ()
  (concat "<!doctype html>"
	  "<html>"   (uiop:read-file-string "www/ndx.html")
	  "<style>"  (uiop:read-file-string "www/site.css") "</style>"
	  "<script>" (uiop:read-file-string "www/app.js")   "</script>"
	  "</html>"))

(defclass websocket-easy-acceptor (websocket-acceptor easy-acceptor) ()
  (:documentation "Special WebSocket easy acceptor"))

(defun start-server (&key port open-browser serve-forever)
  (let*((*server-port* (if port (parse-integer port) *default-port*))
	(*server-url* (format nil "http://localhost:~s/" *server-port*))
	(*server* (make-instance 'websocket-easy-acceptor
				 :document-root "./www/"
				 :port *server-port*))
	)
    (start *server*)
    (format t "listening... - go to ~s~%" *server-url*)
    (if open-browser
	(uiop:run-program (list "open" *server-url*)))
    (if serve-forever
	(loop (sleep 60)))))

(defun main (&rest argv)
  (declare (ignorable argv))
  (format t "main ~s ~a~%" argv argv)
  (start-server :port (car argv) :open-browser (cadr argv) :serve-forever t))
