using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User profile = await _userRepository.GetByIdAsync(Id);

            if (profile == null)
            {
                return null;
            }

            var videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                      ? ""
                      : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

            var cvUrl = string.IsNullOrWhiteSpace(profile.CvName)
                      ? ""
                      : await _fileService.GetFileURL(profile.CvName, FileType.UserCV);

            var languages = profile.Languages.Where(x => !x.IsDeleted).Select(x => ViewModelFromLanguage(x)).ToList();
            var skills = profile.Skills.Where(x => !x.IsDeleted).Select(x => ViewModelFromSkill(x)).ToList();
            var experience = profile.Experience.Select(x => ViewModelFromExperience(x)).ToList();

            var result = new TalentProfileViewModel
            {
                Id = profile.Id,
                FirstName = profile.FirstName,
                MiddleName = profile.MiddleName,
                LastName = profile.LastName,
                Gender = profile.Gender,
                Email = profile.Email,
                Phone = profile.Phone,
                MobilePhone = profile.MobilePhone,
                IsMobilePhoneVerified = profile.IsMobilePhoneVerified,
                Address = profile.Address,
                Nationality = profile.Nationality,
                VisaStatus = profile.VisaStatus,
                VisaExpiryDate = profile.VisaExpiryDate,
                ProfilePhoto = profile.ProfilePhoto,
                ProfilePhotoUrl = profile.ProfilePhotoUrl,
                VideoName = profile.VideoName,
                VideoUrl = videoUrl,
                CvName = profile.CvName,
                CvUrl = cvUrl,
                Summary = profile.Summary,
                Description = profile.Description,
                LinkedAccounts = profile.LinkedAccounts,
                JobSeekingStatus = profile.JobSeekingStatus,
                Languages = languages,
                Skills = skills,
                Experience = experience
            };
            return result;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            try
            {
                if (model.Id == null)
                {
                    return false;
                }

                User existingTalent = await _userRepository.GetByIdAsync(model.Id);
                if (existingTalent == null)
                {
                    return false;
                }

                existingTalent.FirstName = model.FirstName;
                existingTalent.MiddleName = model.MiddleName;
                existingTalent.LastName = model.LastName;
                existingTalent.Gender = model.Gender;
                existingTalent.Email = model.Email;
                existingTalent.Phone = model.Phone;
                existingTalent.MobilePhone = model.MobilePhone;
                existingTalent.Address = model.Address ?? new Address();
                existingTalent.Nationality = model.Nationality;
                existingTalent.VisaStatus = model.VisaStatus;
                // The expiry is a calendar date with no time zone. Store it as UTC midnight so
                // MongoDB doesn't convert it from server-local time and shift it to the previous day.
                existingTalent.VisaExpiryDate = model.VisaExpiryDate.HasValue
                    ? DateTime.SpecifyKind(model.VisaExpiryDate.Value.Date, DateTimeKind.Utc)
                    : (DateTime?)null;
                existingTalent.Summary = model.Summary;
                existingTalent.Description = model.Description;
                existingTalent.LinkedAccounts = model.LinkedAccounts ?? new LinkedAccounts();
                existingTalent.JobSeekingStatus = model.JobSeekingStatus ?? new JobSeekingStatus();
                existingTalent.UpdatedBy = updaterId;
                existingTalent.UpdatedOn = DateTime.Now;

                var newLanguages = new List<UserLanguage>();
                foreach (var item in model.Languages ?? new List<AddLanguageViewModel>())
                {
                    var language = existingTalent.Languages.SingleOrDefault(x => x.Id == item.Id);
                    if (language == null)
                    {
                        language = new UserLanguage
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            UserId = existingTalent.Id,
                            IsDeleted = false
                        };
                    }
                    UpdateLanguageFromView(item, language);
                    newLanguages.Add(language);
                }
                existingTalent.Languages = newLanguages;

                var newSkills = new List<UserSkill>();
                foreach (var item in model.Skills ?? new List<AddSkillViewModel>())
                {
                    var skill = existingTalent.Skills.SingleOrDefault(x => x.Id == item.Id);
                    if (skill == null)
                    {
                        skill = new UserSkill
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            UserId = existingTalent.Id,
                            IsDeleted = false
                        };
                    }
                    UpdateSkillFromView(item, skill);
                    newSkills.Add(skill);
                }
                existingTalent.Skills = newSkills;

                var newExperience = new List<UserExperience>();
                foreach (var item in model.Experience ?? new List<ExperienceViewModel>())
                {
                    var experience = existingTalent.Experience.SingleOrDefault(x => x.Id == item.Id);
                    if (experience == null)
                    {
                        experience = new UserExperience
                        {
                            Id = ObjectId.GenerateNewId().ToString()
                        };
                    }
                    UpdateExperienceFromView(item, experience);
                    newExperience.Add(experience);
                }
                existingTalent.Experience = newExperience;

                await _userRepository.Update(existingTalent);
                return true;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //TODO: Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            // No matching between employers/jobs and talent yet, so every active talent is a suggestion.
            // Most recently updated profiles come first so the feed shows fresh talent.
            var ids = _userRepository.GetQueryable()
                .Where(x => !x.IsDeleted)
                .OrderByDescending(x => x.UpdatedOn)
                .Skip(Math.Max(position, 0))
                .Take(Math.Max(increment, 0))
                .Select(x => x.Id)
                .ToList();

            return Task.FromResult<IEnumerable<string>>(ids);
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            var ids = await GetTalentSuggestionIds(employerOrJobId, forJob, position, increment);
            return await GetTalentSnapshotList(ids);
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            var idList = (ids ?? Enumerable.Empty<string>()).ToList();
            if (idList.Count == 0)
            {
                return new List<TalentSnapshotViewModel>();
            }

            var talents = (await _userRepository.Get(x => idList.Contains(x.Id))).ToList();

            // Return snapshots in the same order as the requested ids.
            var snapshots = new List<TalentSnapshotViewModel>();
            foreach (var id in idList)
            {
                var talent = talents.FirstOrDefault(x => x.Id == id);
                if (talent != null)
                {
                    snapshots.Add(await ViewModelFromTalent(talent));
                }
            }
            return snapshots;
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
        }

        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                Level = language.LanguageLevel,
                Name = language.Language,
                CurrentUserId = language.UserId
            };
        }

        protected async Task<TalentSnapshotViewModel> ViewModelFromTalent(User talent)
        {
            var name = string.Join(" ", new[] { talent.FirstName, talent.MiddleName, talent.LastName }
                .Where(x => !string.IsNullOrWhiteSpace(x)));

            var latestJob = (talent.Experience ?? new List<UserExperience>())
                .OrderByDescending(x => x.Start)
                .FirstOrDefault();

            return new TalentSnapshotViewModel
            {
                Id = talent.Id,
                Name = name,
                PhotoId = talent.ProfilePhotoUrl,
                VideoUrl = string.IsNullOrWhiteSpace(talent.VideoName)
                    ? ""
                    : await _fileService.GetFileURL(talent.VideoName, FileType.UserVideo),
                CVUrl = string.IsNullOrWhiteSpace(talent.CvName)
                    ? ""
                    : await _fileService.GetFileURL(talent.CvName, FileType.UserCV),
                Summary = talent.Summary,
                CurrentEmployment = latestJob?.Company ?? "",
                Visa = talent.VisaStatus,
                Level = latestJob?.Position ?? "",
                Skills = (talent.Skills ?? new List<UserSkill>()).Select(x => x.Skill).ToList(),
                LinkedIn = talent.LinkedAccounts?.LinkedIn,
                Github = talent.LinkedAccounts?.Github
            };
        }

        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //TODO: Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
