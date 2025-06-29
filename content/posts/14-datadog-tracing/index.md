---
title: 'Datadog Tracing Configurations'
date: 2025-06-28T20:51:31-04:00
draft: false
tags: ["SRE", "monitoring", "observability", "datadog", "otel"]
ShowToc: true
---
# Big Idea

Understanding the specifics of Datadog's trace ingestion, sampling, retention, and metrics calculation works can be a confusing task. I want to collect in onve place some of my learnings on this topics from the pov of instrumenting a Python application with Datadog's ddtrace sdk.

##Vocab
- **Ingested Span:** Any span Sent to Datadog

# Ingested Spans vs Indexed Spans (+ Trace Retetion Filters)
- Ingested: kept for 15 mins
- Indexed: Kept for 15 days
- Trace Metrics: 15 months


# Ingestion Mechanisms

Whether or not spans are sent to Datadog (i.e. *ingested*), is configrued by logic in the tracing libraries and the agent.

Any ingested span is additionally tagged with an **ingestion reason** and datadog computes metrics that help us see why spans are ingested:
`datadog.estimated_usage.apm.ingested_bytes` and `datadog.estimated_usage.apm.ingested_spans` are tagged by `ingestion_reason`.

## Datadog-Native Ingestion Sampling

### Head-Based Sampling (Default)
Whether or not a trace is kept is decided at the beginning of a trace, at the start of the root span. This decision is propagated to other spans as part of the request context.

The sampling rate for head-based sampling can be configured in the agent(default) or in the tracing library.

**Agent Configuration (`ingestion reason: auto`)** 

If you configure the sampling rate in the agent, then the agent continuosly sends the configured sampling rate value to the tracing libraries (how?). to apply at the root of traces.

This configuration the agent ca either be configured as part of your agent deployment (i.e. local configuration) or via a remote config in the DD dahsboard if you are using agent version >=7.42.0. 

> The sampling rate in the Agent only gets applies to the Datadog tracing libraries and has no effect on OTel SDKs.

**Library Configuration (`ingestion_reason: rule`)** 

You can also configure the sampling rate directly in the instrumenting tracing library. This is known as user-defined rules. Any sampling rules configured at the SDKs level take precedence over agent configured values.

All spans from a trace ingested using the tracing library configuration are tagged with the ingestion reason: `rule`. In the Configuration colument of the Ingesetion Control page these spans are marked as `Configured`.

### Error & Rare Trace Sampling

Traces that are not retained by head-based sampling may still be retained by an additional layer of sampling mechanism's for error and rare traces. 

> **Note:** Error and rare samplers are ignored for services for which library sampling rules have been configured

**Error Traces (`ingestion_reason: error`)**

The error sampler catches and retains portions of traces that contain error spans and which are not caught by the head-based sampling rules. It catches error traces up to a rate of 10 traces/sec (per Agent). 

**Rare Traces (`ingestion_reason: rare`)**

The rare sampler sends infrequently seen combinations of `env`, `service`, `name`, `resource`, `error.type`, and `http.status` to Datadog. The goal of this sampler is to ensure that lower sampling rates do not diminish visibility of low-traffic services.


## OTel Ingestion Sampling

Instrumenting your serivces with OTel's vendor-agnostic and standards-based SDKs come with different options for sampling and ingestion. In particular, 

### OTel Collector

If you are using the OTel Collector, you can configure the [Datadog Connector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/datadogconnector) as part of your telemetry pipeline. This connector will derive apm statistics based on processed traces.

> Note: If you instrument your services with OTel and configure sampling at the SDK level, the metrics computed by the Datadog Connector will be calculated based on the sampled set of data. In order to ensure that you correctly derive these metrics you should configure sampling within the OTel Collector and downstream of the Datadog connector.

### Datadog Agent OTLP Ingestion
The Datadog Agent can receive traces from the OTel SDK via the OTLP protocol, In this case trace metrics are derived within the agent. 

### OTel Sampling Options

**Head-Based Sampling**

This would be done in the OTel SDK configuration but comes with several caveats.




# Trace Metrics

By default, an application instrumented with Datadog's tracing sdk will also have metrics calculated. The metrics service as a aggregate overview of the system's state. By default the captured metrics are requests count, error coutn, and latency measures. 

Datadog says: *They are calculated based on 100% of the application’s traffic, regardless of any trace ingestion sampling configuration.* 

That isn't clear though. Are these calcualted in the instrumentation, the collector, or DD?

DD says that: By default, these metrics are calculated in the Datadog Agent based on the traces sent from an instrumented application to the Agent.

However, if I have sampling rules configured in my instrumentation does this mean that traces are sampled before the reach the agent?

# Questions:
- Why does the Agent "continuously send sampling rates to tracing libraries to apply at the root of traces."
    - Are spans dropped at the agent of the library?
    - If the DD Agent can calculate APM metrics for the otel SDK then clearly it processes all traces and samples


# Resources
- [APM Metrics](https://docs.datadoghq.com/tracing/metrics/)
- [Trace Metrics](https://docs.datadoghq.com/tracing/metrics/metrics_namespace/)
- [Ingestion & Sampling](https://docs.datadoghq.com/tracing/trace_pipeline/ingestion_mechanisms/?tab=python)
- [OTel Sampling and Ingestion](https://docs.datadoghq.com/opentelemetry/ingestion_sampling/)