import multiprocessing

PREFIX = '/var/www/slides-art.ru/backend'

bind = '127.0.0.1:8000'
workers = 2
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'uvicorn.workers.UvicornWorker'
timeout = 300

accesslog = PREFIX + '/log/access.log'
errorlog = PREFIX + '/log/error.log'