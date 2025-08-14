
from fastapi import APIRouter, Depends, Query, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, text as sql_text
from typing import List, Optional, Dict, Any
from app.database import get_db
from app.models.projects import Project
import logging
import traceback

router = APIRouter()

# Robust debug endpoint: returns first 10 projects as list of dicts
@router.get("/debug-projects/")
def debug_projects(db: Session = Depends(get_db)):
    try:
        sql = sql_text("SELECT * FROM projects LIMIT 10")
        result = db.execute(sql)
        columns = result.keys()
        rows = []
        for row in result:
            try:
                if hasattr(row, "_mapping"):
                    rows.append(dict(row._mapping))
                else:
                    rows.append(dict(zip(columns, row)))
            except Exception as row_exc:
                logging.error(f"Row conversion error: {row_exc}")
                rows.append({"error": str(row_exc)})
        return {"columns": list(columns), "rows": rows}
    except Exception as e:
        logging.error(f"DEBUG: Exception in debug_projects: {e}")
        logging.error(traceback.format_exc())
        return {"error": str(e), "traceback": traceback.format_exc()}


# Unfiltered endpoint for debugging: returns all projects (limit 1000)

# Return all projects using raw SQL to bypass ORM issues
@router.get("/projects/")
def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(1000, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    try:
        sql = sql_text("SELECT * FROM projects OFFSET :skip LIMIT :limit")
        result = db.execute(sql, {"skip": skip, "limit": limit})
        columns = result.keys()
        projects = []
        for row in result:
            if hasattr(row, "_mapping"):
                projects.append(dict(row._mapping))
            else:
                projects.append(dict(zip(columns, row)))
        return projects
    except Exception as e:
        import logging, traceback
        logging.error(f"Exception in /projects/: {e}")
        logging.error(traceback.format_exc())
        return {"error": str(e), "traceback": traceback.format_exc()}

# Raw SQL endpoint for debugging
@router.get("/projects_raw/")
def list_projects_raw(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    sql = sql_text("SELECT * FROM projects OFFSET :skip LIMIT :limit")
    result = db.execute(sql, {"skip": skip, "limit": limit})
    rows = [dict(row) for row in result]
    return rows
