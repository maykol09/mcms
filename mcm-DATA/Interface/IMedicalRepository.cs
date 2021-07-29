using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IMedicalRepository
    {
        DataTable GetMedical(int person_id);
    }
}
