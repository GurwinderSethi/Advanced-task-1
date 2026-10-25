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

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _tempFolder;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment,
            IHttpContextAccessor httpContextAccessor,
            IAwsService awsService)
        {
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
            _tempFolder = "images";
            _awsService = awsService;
        }

        public Task<string> GetFileURL(string id, FileType type)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return Task.FromResult<string>(null);
            }

            // Files are served by the static file middleware at /images/<folder>/<id>.
            // Build an absolute URL so the web app (on a different port) can load it.
            var relativePath = $"/{_tempFolder}/{GetFolder(type)}/{id}";
            var request = _httpContextAccessor.HttpContext?.Request;
            if (request == null)
            {
                return Task.FromResult(relativePath);
            }
            return Task.FromResult($"{request.Scheme}://{request.Host}{relativePath}");
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }
            return await SaveFileGeneral(file, GetFolder(type));
        }

        public Task<bool> DeleteFile(string id, FileType type)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return Task.FromResult(false);
            }
            return Task.FromResult(DeleteFileGeneral(id, GetFolder(type)));
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string folder)
        {
            var directory = Path.Combine(_environment.ContentRootPath, _tempFolder, folder);
            Directory.CreateDirectory(directory);

            // Use a generated name so uploads never collide or overwrite each other.
            var fileName = $"{Guid.NewGuid():N}{Path.GetExtension(file.FileName).ToLower()}";
            using (var stream = new FileStream(Path.Combine(directory, fileName), FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName;
        }

        private bool DeleteFileGeneral(string id, string folder)
        {
            // Path.GetFileName strips any directory parts, so an id can't point outside the folder.
            var path = Path.Combine(_environment.ContentRootPath, _tempFolder, folder, Path.GetFileName(id));
            if (!File.Exists(path))
            {
                return false;
            }
            File.Delete(path);
            return true;
        }

        private static string GetFolder(FileType type)
        {
            switch (type)
            {
                case FileType.ProfilePhoto:
                    return "photos";
                case FileType.UserVideo:
                    return "videos";
                case FileType.UserCV:
                    return "cvs";
                default:
                    throw new ArgumentOutOfRangeException(nameof(type), type, null);
            }
        }
        #endregion
    }
}
