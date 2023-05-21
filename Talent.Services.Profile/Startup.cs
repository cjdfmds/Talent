using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Talent.Common.Auth;
using Talent.Common.Commands;
using Talent.Common.Contracts;
using Talent.Common.Mongo;
using Talent.Common.RabbitMq;
using Talent.Common.Security;
using Talent.Common.Services;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Domain.Services;
using Talent.Services.Profile.Handler;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Talent.Common.Aws;


namespace Talent.Services.Profile
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
            // Configure CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowWebApp", builder =>
                {
                    builder.WithOrigins("http://localhost:61771", "http://localhost:61772")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                });
            });

            // Configure FormOptions for request size limits
            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue;
                x.MultipartHeadersLengthLimit = int.MaxValue;
            });

            // Configure MVC and JSON serialization
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
            });

            // Add JWT authentication
            services.AddJwt(Configuration);

            // Add MongoDB
            services.AddMongoDB(Configuration);

            // Add RabbitMQ
            services.AddRabbitMq(Configuration);

            // Add AWS
            services.AddAws(Configuration);

            // Add command handler
            services.AddScoped<ICommandHandler<AuthenticateUser>, AuthenticateUserHandler>();

            // Add repository
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            // Add authentication service
            services.AddScoped<IAuthenticationService, AuthenticationService>();

            // Add HTTP context accessor
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Resolve the current principal
            Func<IServiceProvider, IPrincipal> getPrincipal =
                     (sp) => sp.GetService<IHttpContextAccessor>().HttpContext.User;
            services.AddScoped(typeof(Func<IPrincipal>), sp =>
            {
                Func<IPrincipal> func = () => getPrincipal(sp);
                return func;
            });

            // Add user application context
            services.AddScoped<IUserAppContext, UserAppContext>();

            // Add profile service
            services.AddScoped<IProfileService, ProfileService>();

            // Add file service
            services.AddScoped<IFileService, FileService>();
           

            // Add logging to console
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConsole();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                // Show detailed exception page in development environment
                app.UseDeveloperExceptionPage();

            }

            // Enable CORS
            app.UseCors("AllowWebApp");

            // just for the sake of development
            app.UseStaticFiles();

            // Use MVC
            app.UseMvc();

            // Log a message
            logger.LogInformation("Application startup completed.");
        }
    }
}
