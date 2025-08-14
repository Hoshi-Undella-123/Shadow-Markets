from sqlalchemy import create_engine, text
import os

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user@localhost:5432/shadow")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

def validate_data():
    print("Validating project data in database...")
    
    with engine.connect() as conn:
        # Check total number of projects
        query = text("""
            SELECT COUNT(*) as total_count
            FROM projects;
        """)
        result = conn.execute(query).first()
        total_count = result[0] if result else 0
        print(f"\nTotal projects in database: {total_count}")
        
        # Check projects by source
        query = text("""
            SELECT source, COUNT(*) as count
            FROM projects
            GROUP BY source
            ORDER BY count DESC;
        """)
        results = conn.execute(query).fetchall()
        print("\nProjects by source:")
        for source, count in results:
            print(f"- {source}: {count}")
        
        # Check projects needing funding
        query = text("""
            SELECT source, COUNT(*) as count
            FROM projects
            WHERE needs_funding = true
            GROUP BY source
            ORDER BY count DESC;
        """)
        results = conn.execute(query).fetchall()
        print("\nProjects needing funding by source:")
        for source, count in results:
            print(f"- {source}: {count}")
        
        # Check projects by region
        query = text("""
            SELECT region, COUNT(*) as count
            FROM projects
            WHERE region IS NOT NULL
            GROUP BY region
            ORDER BY count DESC
            LIMIT 10;
        """)
        results = conn.execute(query).fetchall()
        print("\nTop 10 regions by project count:")
        for region, count in results:
            print(f"- {region}: {count}")
        
        # Check projects by sector
        query = text("""
            SELECT sectors[1] as sector, COUNT(*) as count
            FROM projects
            WHERE sectors IS NOT NULL AND array_length(sectors, 1) > 0
            GROUP BY sectors[1]
            ORDER BY count DESC
            LIMIT 10;
        """)
        results = conn.execute(query).fetchall()
        print("\nTop 10 sectors by project count:")
        for sector, count in results:
            print(f"- {sector}: {count}")

        # Check projects by country
        query = text("""
            SELECT country, COUNT(*) as count
            FROM projects
            WHERE country IS NOT NULL
            GROUP BY country
            ORDER BY count DESC
            LIMIT 10;
        """)
        results = conn.execute(query).fetchall()
        print("\nTop 10 countries by project count:")
        for country, count in results:
            print(f"- {country}: {count}")

        # Check projects by project type
        query = text("""
            SELECT project_type, COUNT(*) as count
            FROM projects
            WHERE project_type IS NOT NULL
            GROUP BY project_type
            ORDER BY count DESC
            LIMIT 10;
        """)
        results = conn.execute(query).fetchall()
        print("\nTop 10 project types by count:")
        for project_type, count in results:
            print(f"- {project_type}: {count}")

        # Check projects with missing key fields
        query = text("""
            SELECT COUNT(*) FROM projects WHERE country IS NULL OR region IS NULL OR sectors IS NULL OR array_length(sectors, 1) = 0;
        """)
        missing_count = conn.execute(query).scalar()
        print(f"\nProjects missing country, region, or sector: {missing_count}")

        # Check projects with multiple sectors
        query = text("""
            SELECT COUNT(*) FROM projects WHERE sectors IS NOT NULL AND array_length(sectors, 1) > 1;
        """)
        multi_sector_count = conn.execute(query).scalar()
        print(f"\nProjects with multiple sectors: {multi_sector_count}")

if __name__ == "__main__":
    validate_data()
