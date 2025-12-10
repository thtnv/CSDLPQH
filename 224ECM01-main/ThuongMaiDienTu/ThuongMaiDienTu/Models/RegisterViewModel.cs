using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ThuongMaiDienTu.Models
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Please enter full name.")]
        [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters.")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Please enter phone number.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Please enter address.")]
        [StringLength(200, ErrorMessage = "Address cannot exceed 200 characters.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Please enter email.")]
        [EmailAddress(ErrorMessage = "Invalid email.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Please enter password.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be 6-100 characters.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Please confirm password.")]
        public string ConfirmPassword { get; set; }
    }
}