using mcm_DATA.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IReferenceRepository

    {
        User GetCurrentUser(string currentUsername);
        DataTable GetDiagnosis(string input);
        Reference GetReference();
    }
}
