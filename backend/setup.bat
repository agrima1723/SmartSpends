@echo off
REM Create directory structure
if not exist models mkdir models
if not exist routes mkdir routes
if not exist controllers mkdir controllers
if not exist middleware middleware
if not exist utils mkdir utils
if not exist config mkdir config

echo ✓ Backend directory structure created
