using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using datingapp.api.Data;
using datingapp.api.Dtos;
using datingapp.api.Helpers;
using datingapp.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace datingapp.api.Controllers
{
    [ApiController]
    [Route("api/users/{userId}/photos")]
    [Authorize]
    public class PhotoController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotoController(IDatingRepository repo,
                IMapper mapper,
                IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _repo = repo;
            _mapper = mapper;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
               

            );
            _cloudinary = new Cloudinary(acc);
            
        }
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFormRepo = await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFormRepo);
            return Ok(photo);
        }
        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,
        [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(userId);
            var file = photoForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            if(file.Length > 0) {

                using(var stream = file.OpenReadStream())
                {
                    var uploadOptions = new ImageUploadParams {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadOptions);
                }

                photoForCreationDto.Url = uploadResult.Uri.ToString();
                photoForCreationDto.PublicId = uploadResult.PublicId;

                var photo = _mapper.Map<Photo>(photoForCreationDto);

                if(!userFromRepo.Photos.Any(u => u.IsMain ))
                    photo.IsMain = true;

                userFromRepo.Photos.Add(photo);
                if(await _repo.SaveAll())
                {
                    var photoForReturn = _mapper.Map<PhotoForReturnDto>(photo);
                    //return Ok(photoForReturn);
                   // return CreatedAtRoute("GetPhoto", new {id = photo.Id}, photoForReturn);
                   // return CreatedAtRoute("GetPhoto", new {id = photo.Id}, photoForReturn);
                   //return CreatedAtAction("GetPhoto", photoForReturn);
                    return Created(photoForReturn.Url, photoForReturn);
                }
                 

            }
            return BadRequest("Cound not save photo");  
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            if(!user.Photos.Any(p => p.Id == userId))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id)  ;

            if(photoFromRepo.IsMain)
                return BadRequest("Photo is already main");

            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if(await _repo.SaveAll())
                return NoContent();

            return BadRequest("Could not set the photo main");    



        }

         [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            if(!user.Photos.Any(p => p.Id == userId))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id)  ;

            if(photoFromRepo.IsMain)
                return BadRequest("You can't delete the main photo");

            if(photoFromRepo.PublicId != null) 
            {
               var deletionParam = new DeletionParams(photoFromRepo.PublicId);

            var result = _cloudinary.Destroy(deletionParam);

            if(result.Result == "ok")
            {
                _repo.Delete(photoFromRepo);
                if(await _repo.SaveAll()){
                    return Ok();
                }
            } 
            }
            else {
                _repo.Delete(photoFromRepo);
                if(await _repo.SaveAll()){
                    return Ok();
                } 
            }
            


            return BadRequest("Failed to delete photo");


        }
}
}