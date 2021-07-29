using mcm_DATA.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IReportsRepository
    {
        IReadOnlyCollection<Consultation> GetConsultationReports(string from, string to);
        IReadOnlyCollection<Medication> GetMedicationReports(string from, string to);
        IReadOnlyCollection<MedicineDetails> GetMedicineReports();
    }
}

