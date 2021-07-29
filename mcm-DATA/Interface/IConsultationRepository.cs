using mcm_DATA.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IConsultationRepository
    {
        DataTable GetConsultation(int person_id);
        int SaveConsultation(Consultation data);
        void DeleteConsultation(int[] consultation_ids);
        IReadOnlyCollection<Medication> GetConsultationMed(int person_id, int consultation_id);
    }
}
