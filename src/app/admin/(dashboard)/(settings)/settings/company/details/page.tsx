'use client'
import { ICompanyDetails } from "@/common/types/company/companyDetails.interface";
import CompanyDetailsForm from "@/components/common/forms/company/companyDetails";

export default function CompanyDetailsSettings() {
    return (
        <CompanyDetailsForm 
            details={{} as ICompanyDetails}
        />
    )
}