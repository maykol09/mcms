using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IMedicationRepository
    {
        DataTable GetMedication(int person_id);
    }
}
