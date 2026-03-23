"""
Logging Configuration for IACP 3.0
Structured JSON logging
"""

import structlog
import logging
import sys
from datetime import datetime

# Configure structlog
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# Get logger
logger = structlog.get_logger()

# Setup basic logging
logging.basicConfig(
    format="%(message)s",
    stream=sys.stdout,
    level=logging.INFO
)

# Example usage:
# logger.info("case_docketed", case_id="2026-BLA-00011", user_id="user-123", duration_ms=150)
# logger.error("database_error", error=str(e), query="SELECT * FROM cases")
