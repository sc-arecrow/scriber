class User < ApplicationRecord
  has_secure_password

  has_many :tasks, dependent: :destroy
  has_many :tags, dependent: :destroy

  validates :email, presence: true, uniqueness: {case_sensitive: false}, format: {with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, message: "not a valid email"}
  validates :password, presence: true, length: {minimum: 8}
  validates :password_confirmation, presence: true, length: {minimum: 8}
end
