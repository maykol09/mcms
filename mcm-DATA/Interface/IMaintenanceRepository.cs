using mcm_DATA.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace mcm_DATA.Interface
{
    public interface IMaintenanceRepository
    {
        IReadOnlyCollection<UserAccess> GetUser();
        void SaveUser(List<UserAccess> data);
        void DeleteUser(int user_id);

        IReadOnlyCollection<LibReference> GetReference();
        void SaveReference(List<LibReference> data);
        void DeleteReference(int ref_id);
    }
}
