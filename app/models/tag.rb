class Tag < ApplicationRecord
  belongs_to :user

  has_and_belongs_to_many :tasks

  validates :name, presence: true
  validates :colour, presence: true
end
