require 'opentelemetry/sdk'
require 'opentelemetry/exporter/otlp'
require 'opentelemetry/instrumentation/all'

# Load the Rails application.
require_relative "application"

OpenTelemetry::SDK.configure do |c|
  c.service_name  = 'sharkapp'
  c.use_all
end

# Initialize the Rails application.
Rails.application.initialize!
