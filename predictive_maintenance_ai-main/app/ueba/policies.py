ACCESS_CONTROL_MATRIX = {
    "DataAnalysis": {
        "allowed_services": ["TelematicsRepo", "VehicleRepo", "MaintenanceRepo"],
        "risk_limit": "LOW",
    },
    "Diagnosis": {
        "allowed_services": ["LLM_Inference"],
        "risk_limit": "MEDIUM",
    },
    "CustomerEngagement": {
        "allowed_services": ["NotificationRepo", "LLM_Inference"],
        "risk_limit": "LOW",
    },
    "Scheduling": {
        "allowed_services": ["SchedulerRepo", "NotificationRepo"],
        "risk_limit": "HIGH",
    },
    "Feedback": {
        "allowed_services": ["NotificationRepo"],
        "risk_limit": "LOW",
    },
    "Manufacturing": {
        "allowed_services": ["MaintenanceRepo", "LLM_Inference"],
        "risk_limit": "MEDIUM",
    },
}


def check_permission(agent_name: str, service_name: str) -> bool:
    policy = ACCESS_CONTROL_MATRIX.get(agent_name)
    if not policy:
        return False
    return service_name in policy["allowed_services"]