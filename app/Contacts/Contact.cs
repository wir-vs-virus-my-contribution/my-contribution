using System;
using System.ComponentModel.DataAnnotations;

namespace MyContribution.Contacts
{
    public class Contact
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }

    public class Skill
    {
        public Guid Id { get; set; }
        public string Title { get; set; }

    }

    public class Field
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

    }
    public class RelativeTime
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public int TimeAsNumber { get; set; }
        public bool Future { get; set; }

    }

    public class RegisterRequest
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Institution { get; set; }
        public string PassHash { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }

    }

    public class Offer
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public Field FieldOfWork { get; set; }
        [Required]
        public char Gender { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Phone]
        public string Phone { get; set; }
        [Required,EmailAddress]
        public string Email { get; set; }
        [Required]
        public RelativeTime LastWorked { get; set; }
        public bool CoronaPassed { get; set; }
        [Required]
        public RelativeTime AvailableFrom { get; set; }
        [Required]
        public string Adresse { get; set; }
        [Required]
        public int Radius { get; set; }
        public string Comment { get; set; }

    }
    public class OfferToSkill
    {
        public Guid Id { get; set; }
        public int OfferId { get; set; }
        public int SkillId { get; set; }

    }
}
