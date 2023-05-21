using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;
using Microsoft.Extensions.Configuration;



namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private readonly IAwsService _awsService;
        private readonly IConfiguration _configuration;

        public FileService(IHostingEnvironment environment, IAwsService awsService, IConfiguration configuration)
        {
            _environment = environment;
            _tempFolder = "images";
            _awsService = awsService;
            _configuration = configuration;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            var filePath = "";
            //var localWebRoot = "C:\\Users\\mdscj\\OneDrive\\Documents\\GitHub\\Talent3\\Talent\\App\\Talent.App.WebApp\\wwwroot\\";

            if (type == FileType.ProfilePhoto)
            {
                if (_environment.IsDevelopment()) // Check if in development mode
                {
                    //filePath = Path.Combine(localWebRoot, _tempFolder, id);
                    //filePath = new Uri(filePath).LocalPath;

                    filePath = Path.Combine(_tempFolder, id);
                }
                else
                {
                    filePath = Path.Combine(_tempFolder, id);
                }
            }

            return filePath;
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            var uniqueFileName = "";
            var pathWeb = _environment.WebRootPath;          
            var localWebRoot = "C:\\Users\\mdscj\\OneDrive\\Documents\\GitHub\\Talent3\\Talent\\Talent.Services.Profile\\wwwroot\\";

            if (type == FileType.ProfilePhoto)
            {
                if (_environment.IsDevelopment()) // Check if in development mode
                {
                    uniqueFileName = $@"{DateTime.Now.Ticks}_" + file.FileName;
                    var filePath = Path.Combine(localWebRoot, _tempFolder, uniqueFileName);

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await file.CopyToAsync(stream);
                    }
                }
                else
                {
                    uniqueFileName = $@"{DateTime.Now.Ticks}_" + file.FileName;
                    var filePath = Path.Combine(Path.Combine(pathWeb, _tempFolder), uniqueFileName);

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await file.CopyToAsync(stream);
                    }
                }

            }

            return uniqueFileName;
        }



        public async Task<bool> DeleteFile(string id, FileType type)
        {
            try
            {
                var filePath = await GetFileURL(id, type);
                File.Delete(filePath);
                return true;

            }
            catch (Exception e)
            {
                return false;
            }
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion

    }
}

