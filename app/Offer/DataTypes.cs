using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyContribution.Backend
{
    public class DataTypes
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

    public class AccountRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Institution { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Address { get; set; }

    }
    public class Account
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Institution { get; set; }
        public string PassHash { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public DateTime TimeOfRegister { get; set; }

    }

    public class OfferRequest
    {
        public string Name { get; set; }
        [Required]
        public Guid[] Fields { get; set; }
        public Guid[] Skills { get; set; }
        public char Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string LastWorked { get; set; }
        public bool CoronaPassed { get; set; }
        public string AvailableFrom { get; set; }
        public string Address { get; set; }
        public Location Location { get; set; }
        /// <summary>
        /// Years of professional experience
        /// </summary>
        public int Experience { get; set; }
        [Required]
        public int Radius { get; set; }
        public string Comment { get; set; }
    }

    public class Location
    {
        public double Longitude { get; set; }
        public double Latitude { get; set; }
    }

    public class Offer
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public List<Offer_Field> Fields { get; set; }
        public List<Offer_Skill> Skills { get; set; }
        [Required]
        public char Gender { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        public string Experience { get; set; }
        public string Phone { get; set; }
        [Required,EmailAddress]
        public string Email { get; set; }
        [Required]
        public string LastWorked { get; set; }
        public bool CoronaPassed { get; set; }
        [Required]
        public string AvailableFrom { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public int Radius { get; set; }
        public string Comment { get; set; }
        public decimal Entfernung { get; set; }

    }
    public class Offer_Field
    {
        public Guid OfferId { get; set; }
        public Offer Offer { get; set; }
        public Guid FieldId { get; set; }
        public Field Field { get; set; }

        public override int GetHashCode()
        {
            return OfferId.GetHashCode() + FieldId.GetHashCode();
        }
        public override bool Equals(object obj)
        {
            return (obj as Offer_Field)?.OfferId == OfferId && (obj as Offer_Field)?.FieldId == FieldId;
        }

    }
    public class Offer_Skill
    {
        public Guid OfferId { get; set; }
        public Guid SkillId { get; set; }
        public Skill Skill { get; set; }

        public override int GetHashCode()
        {
            return OfferId.GetHashCode() + SkillId.GetHashCode();
        }
        public override bool Equals(object obj)
        {
            return (obj as Offer_Skill)?.OfferId == OfferId && (obj as Offer_Skill)?.SkillId == SkillId;
        }

    }
    public class AddressRequest
    {
        public string Full { get; set; }
    }

    public class Address
    {
        public string Full { get; set; }
        public string Street { get; set; }
        public int Number { get; set; }
        public string Zip { get; set; }
        public string Country { get; set; }
        public string longitude { get; set; }
        public string latitude { get; set; }
    }
}
