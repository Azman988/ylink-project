import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

const TEMPLATES = {
    REPAIR: import.meta.env.VITE_EMAILJS_REPAIR_TEMPLATE_ID || "",
    BOOKING: import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID || "",
};

// Rate limiting helper (Default: 1 hour cooldown)
export const isRateLimited = (formKey: string, cooldownMs: number = 3600000): boolean => {
    const lastSubmitted = localStorage.getItem(`last_submit_${formKey}`);
    if (lastSubmitted) {
        const timePassed = Date.now() - parseInt(lastSubmitted, 10);
        if (timePassed < cooldownMs) {
            return true; // Still rate limited
        }
    }
    return false;
};

export const recordSubmission = (formKey: string) => {
    localStorage.setItem(`last_submit_${formKey}`, Date.now().toString());
};

// Form Interfaces including optional honeypot field
export interface RepairFormData {
    name: string;
    email: string;
    phone: string;
    deviceCategory: string;
    deviceModel: string;
    issue: string;
    honeypot?: string; // Hidden bot field
}

export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    propertyType: "home" | "business";
    powerNeed: string;
    honeypot?: string; // Hidden bot field
}

/**
 * Send Repair Email with Rate Limit & Honeypot Checks
 */
export const sendRepairEmail = async (data: RepairFormData) => {
    // 1. Check Honeypot: If filled, fake success and don't spend EmailJS quota
    if (data.honeypot && data.honeypot.trim() !== "") {
        console.warn("Spam submission blocked by honeypot.");
        return { status: 200, text: "OK" }; 
    }

    // 2. Check Rate Limit
    if (isRateLimited("repair_form")) {
        throw new Error("Waiting review... Please wait 60 minutes before submitting another repair ticket.");
    }

    const templateParams = {
        subject: `New Repair Ticket: ${data.deviceModel} - ${data.name}`,
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        device_category: data.deviceCategory === "laptop" ? "PC / Mac" : "Mobile",
        device_model: data.deviceModel,
        issue: data.issue,
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATES.REPAIR, templateParams, PUBLIC_KEY);
    
    // Record timestamp after successful send
    recordSubmission("repair_form");
    return response;
};

/**
 * Send Booking Email with Rate Limit & Honeypot Checks
 */
export const sendBookingEmail = async (data: BookingFormData) => {
    // 1. Check Honeypot
    if (data.honeypot && data.honeypot.trim() !== "") {
        console.warn("Spam submission blocked by honeypot.");
        return { status: 200, text: "OK" }; 
    }

    // 2. Check Rate Limit
    if (isRateLimited("booking_form")) {
        throw new Error("Waiting review... Please wait 60 minutes before booking another site assessment.");
    }

    const templateParams = {
        subject: `New Site Assessment: ${data.propertyType.toUpperCase()} - ${data.name}`,
        from_name: data.name,
        from_email: data.email || "N/A",
        phone: data.phone,
        address: data.address,
        property_type: data.propertyType === "home" ? "Home" : "Business",
        power_need: data.powerNeed,
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATES.BOOKING, templateParams, PUBLIC_KEY);
    
    // Record timestamp after successful send
    recordSubmission("booking_form");
    return response;
};