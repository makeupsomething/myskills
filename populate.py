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

# Create dummy user

User1 = User(name="Toy Man", email="tman@test.com",
            picture='https://randomuser.me/api/portraits/lego/4.jpg')
session.add(User1)
session.commit()

User1 = User(name="Toy Man", email="tman@test.com",
            picture='https://randomuser.me/api/portraits/lego/0.jpg')
session.add(User1)
session.commit()

User1 = User(name="Toy Man", email="tman@test.com",
            picture='https://randomuser.me/api/portraits/lego/1.jpg')
session.add(User1)
session.commit()

User1 = User(name="Toy Man", email="tman@test.com",
            picture='https://randomuser.me/api/portraits/lego/2.jpg')
session.add(User1)
session.commit()

User1 = User(name="Toy Man", email="tman@test.com",
            picture='https://randomuser.me/api/portraits/lego/3.jpg')
session.add(User1)
session.commit()

User1 = User(name="Toy Man", email="tman@test.com",
            picture='https://randomuser.me/api/portraits/lego/5.jpg')
session.add(User1)
session.commit()

User1 = User(name="Toy Man", email="tman@test.com",
            picture='https://randomuser.me/api/portraits/lego/6.jpg')
session.add(User1)
session.commit()

skill1 = SkillType(name="Python")

session.add(skill1)
session.commit()

skill2 = SkillType(name="Javascript")

session.add(skill2)
session.commit()


skill2 = SkillType(name="Java")

session.add(skill2)
session.commit()

skill2 = SkillType(name="C#")

session.add(skill2)
session.commit()

skill2 = SkillType(name="Ruby")

session.add(skill2)
session.commit()

skill2 = SkillType(name="Golang")

session.add(skill2)
session.commit()

skill2 = SkillType(name="HTML")

session.add(skill2)
session.commit()

skill2 = SkillType(name="CSS")

session.add(skill2)
session.commit()

skill2 = SkillType(name="TDD")

session.add(skill2)
session.commit()

skill2 = SkillType(name="Windows")

session.add(skill2)
session.commit()

skill2 = SkillType(name="MacOS")

session.add(skill2)
session.commit()

skill2 = SkillType(name="Linux")

session.add(skill2)
session.commit()