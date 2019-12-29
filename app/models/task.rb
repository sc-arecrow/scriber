class Task < ApplicationRecord
  belongs_to :user

  has_and_belongs_to_many :tags

  validates :title, presence: true
end
