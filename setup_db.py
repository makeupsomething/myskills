import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, column_property
from sqlalchemy import create_engine
from sqlalchemy.sql import func, select, and_

Base = declarative_base()

class Endorsement(Base):
    __tablename__ = 'endorsement'

    id = Column(Integer, primary_key=True)
    skill_id = Column(Integer, ForeignKey('skill.id'))
    endorsed_by_id = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id': self.id,
            'skill_id': self.skill_id,
            'endorsed_by_id': self.endorsed_by_id,
            'user_id': self.user_id
        }

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)
    picture = Column(String(250), nullable=True)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    total_endorsement_count = column_property(
        select([func.count(Endorsement.id)]).\
            where(Endorsement.user_id==id ).\
            correlate_except(Endorsement)
    )

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'picture': self.picture,
            'time_created': self.time_created,
            'time_updated': self.time_updated,
            'total_endorsement_count': self.total_endorsement_count
        }

class SkillType(Base):
    __tablename__ = 'skilltype'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    total_endorsement_count = column_property(
        select([func.count(Endorsement.id)]).\
            where(Endorsement.skill_id==id ).\
            correlate_except(Endorsement)
    )

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id': self.id,
            'name': self.name,
            'total_endorsement_count': self.total_endorsement_count
        }


class Skill(Base):
    __tablename__ = 'skill'
    id = Column(Integer, primary_key=True)
    user_id =  Column(Integer, ForeignKey('user.id'))
    user = relationship(User)
    skill_id = Column(Integer, ForeignKey('skilltype.id'))
    skill = relationship(SkillType)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    endorsement_count = column_property(
        select([func.count(Endorsement.id)]).\
            where(Endorsement.user_id==user_id ).where(Endorsement.skill_id == skill_id).\
            correlate_except(Endorsement)
    )

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id': self.id,
            'skill_id': self.skill_id,
            'skill_name': self.skill.name, 
            'time_created': self.time_created,
            'time_updated': self.time_updated, 
            'endorsement_count': self.endorsement_count
        }


engine = create_engine('sqlite:///userandskills.db')

Base.metadata.create_all(engine)
