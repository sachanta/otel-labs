export OTEL_RESOURCE_ATTRIBUTES=service.namespace=python,service.name=python-mysql,host.name=srikar-vm,resource.type=host
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4318/v1/traces
python3 new_app.py
