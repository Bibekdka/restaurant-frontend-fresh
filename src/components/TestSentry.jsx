import React from 'react';
import * as Sentry from "@sentry/react";

export default function TestSentry() {
    const handleButtonClick = () => {
        Sentry.startSpan(
            {
                op: "ui.click",
                name: "Test Sentry Button Click",
            },
            (span) => {
                const value = "test-config-value";
                span.setAttribute("config", value);

                // Log actions
                console.log("Triggering Sentry test logs...");

                // Using Sentry logger if available (or just console which is integrated)
                console.info("Info log from TestSentry");
                console.warn("Warning log from TestSentry");

                // Explicitly send a log message as requested
                Sentry.captureMessage('User triggered test log', {
                    level: 'info',
                    tags: { log_source: 'sentry_test' }
                });

                // Sentry Metrics
                try {
                    if (Sentry.metrics) {
                        // Counters (increment is the standard method for 'count')
                        Sentry.metrics.increment('test_button_click', 1);
                        // Gauge
                        Sentry.metrics.gauge('test_gauge_value', 150);
                        // Distribution
                        Sentry.metrics.distribution('test_distribution_value', 200);
                        console.log("Sentry metrics sent");
                    } else {
                        console.warn("Sentry.metrics is not available");
                    }
                } catch (e) {
                    console.error("Error sending metrics:", e);
                }

                // Simulate some work
                setTimeout(() => {
                    span.end();
                    alert("Sentry Span & Logs sent!");
                }, 500);
            }
        );
    };

    const handleErrorClick = () => {
        try {
            throw new Error("Manually triggered Sentry Error");
        } catch (error) {
            Sentry.captureException(error);
            alert("Sentry Exception sent!");
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px dashed red', margin: '20px 0', borderRadius: '8px' }}>
            <h3>Sentry Debug Tools</h3>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={handleButtonClick} className="btn" style={{ background: '#3b82f6', color: 'white' }}>
                    Test Span & Logs
                </button>
                <button onClick={handleErrorClick} className="btn" style={{ background: '#ef4444', color: 'white' }}>
                    Test Exception
                </button>
            </div>
        </div>
    );
}
