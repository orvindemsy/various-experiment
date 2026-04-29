MAKEFILE_PATH := $(shell dirname $(abspath $(lastword $(MAKEFILE_LIST))))
PROJECT_ROOT := $(abspath $(MAKEFILE_PATH)/../..)

IMAGE_FLAVOR ?= cpu

LOCAL_DOCKER_REPO ?= nowcast
LOCAL_VERSION ?= devcontainer

LOCAL_PORT ?= 8888

build:
	docker build -t $(LOCAL_DOCKER_REPO):$(LOCAL_VERSION) -f Dockerfile $(PROJECT_ROOT)

rm:
	docker ps -a | grep nowcast-devcontainer \
		&& docker rm -f nowcast-devcontainer \
		|| echo "Container is not running."

run: SHM_SIZE ?= $(shell echo $$(($$(docker info -f '{{json .MemTotal}}') / 1024 / 1024 / 1024 / 2)))
run:
	@docker ps -a | grep nowcast-devcontainer \
		&& echo "Already running! make rm run if you want to relaunch." \
		|| docker run --name nowcast-devcontainer -d \
			-p $(LOCAL_PORT):8888 --shm-size=$(SHM_SIZE)gb \
			--env-file $(PROJECT_ROOT)/.env.local \
			-v $(PROJECT_ROOT):/app \
			$(RUN_ARGS) \
			nowcast:devcontainer
	@printf "Jupyter Notebook%-6s http://localhost:$(LOCAL_PORT)/tree\n"
	@printf "JupyterLab%-12s http://localhost:$(LOCAL_PORT)/lab\n"

exec:
	docker exec -it nowcast-devcontainer $(CMD)

bash:
	$(MAKE) exec CMD=bash

