using mcm_DATA.Interface;
using mcm_DATA.Interface.Service;
using mcm_DATA.Repository;
using mcm_DATA.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NBC_DATA.Context;
using NBC_DATA.Interface.AdoProcedure;
using NBC_DATA.Repository;
using System.Text.Json;
using Microsoft.Identity.Web;

namespace mcm
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            //services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddMicrosoftIdentityWebApi(Configuration);
            services.AddAuthorization();

            // In production, the Angular files will be served from this directory
            services.AddControllers().AddJsonOptions(o =>
            {
                o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                o.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
                o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                o.JsonSerializerOptions.WriteIndented = true;
            });
            // In production, the Angular files will be served from this directory
            services.AddTransient<IDatabaseContextFactory, DatabaseContextFactory>(seriveProvider =>
            {
                var connectionString = Configuration["ConnectionString"];
                return new DatabaseContextFactory(connectionString);
            });
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddTransient<IAdoProcedureRepository, AdoProcedureRepository>();
            services.AddTransient<IStaffListRepository, StaffListRepository>();
            services.AddTransient<IPersonDetailsRepository, PersonDetailsRepository>();
            services.AddTransient<IConsultationRepository, ConsultationRepository>();
            services.AddTransient<IMedicationRepository, MedicationRepository>();
            services.AddTransient<IMedicalRepository, MedicalRepository>();
            services.AddTransient<IReferenceRepository, ReferenceRepository>();
            services.AddTransient<IMedicineRepository, MedicineRepository>();
            services.AddTransient<IReportsRepository, ReportsRepository>();
            services.AddTransient<IReceiptsRepository, ReceiptsRepository>();
            services.AddTransient<IMaintenanceRepository, MaintenanceRepsitory>();
            services.AddTransient<IReferenceExtension, ReferenceExtension>();
            
            services.AddAuthentication(IISDefaults.AuthenticationScheme);
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
            services.AddControllersWithViews().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;

            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
