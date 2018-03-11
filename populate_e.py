from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from setup_db import SkillType, Base, Skill, User, Endorsement

engine = create_engine('sqlite:///userandskills.db')
# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
# A DBSession() instance establishes all conversations with the database
# and represents a "staging zone" for all the objects loaded into the
# database session object. Any change made against the objects in the
# session won't be persisted into the database until you call
# session.commit(). If you're not happy about the changes, you can
# revert all of them back to the last commit by calling
# session.rollback()
session = DBSession()

#User 1
endorsement = Endorsement(skill_id="1", endorsed_by_id="2", user_id="1")
skill = Skill(user_id="1", skill_id="1")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="1", endorsed_by_id="3", user_id="1")
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="2", endorsed_by_id="4", user_id="1")
skill = Skill(user_id="1", skill_id="2")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="7", endorsed_by_id="5", user_id="1")
skill = Skill(user_id="1", skill_id="7")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

#User 2
endorsement = Endorsement(skill_id="5", endorsed_by_id="2", user_id="2")
skill = Skill(user_id="2", skill_id="5")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="5", endorsed_by_id="3", user_id="2")
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="5", endorsed_by_id="4", user_id="2")
session.add(endorsement)
session.commit()

#User 3
endorsement = Endorsement(skill_id="6", endorsed_by_id="2", user_id="3")
skill = Skill(user_id="3", skill_id="6")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="2", endorsed_by_id="3", user_id="3")
skill = Skill(user_id="3", skill_id="2")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="1", endorsed_by_id="4", user_id="3")
skill = Skill(user_id="3", skill_id="1")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="1", endorsed_by_id="5", user_id="3")
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="4", endorsed_by_id="6", user_id="3")
skill = Skill(user_id="4", skill_id="3")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="4", endorsed_by_id="7", user_id="3")
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="4", endorsed_by_id="2", user_id="3")
session.add(endorsement)
session.commit()

#User 4
endorsement = Endorsement(skill_id="6", endorsed_by_id="2", user_id="4")
skill = Skill(user_id="4", skill_id="6")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="2", endorsed_by_id="3", user_id="4")
skill = Skill(user_id="4", skill_id="2")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="1", endorsed_by_id="4", user_id="4")
skill = Skill(user_id="4", skill_id="1")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="1", endorsed_by_id="5", user_id="4")
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="4", endorsed_by_id="6", user_id="4")
skill = Skill(user_id="4", skill_id="4")
session.add(skill)
session.commit()
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="4", endorsed_by_id="7", user_id="4")
session.add(endorsement)
session.commit()

endorsement = Endorsement(skill_id="4", endorsed_by_id="2", user_id="4")
session.add(endorsement)
session.commit()

