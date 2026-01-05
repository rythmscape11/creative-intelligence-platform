from kfp import dsl
from kfp import compiler

@dsl.component(base_image='python:3.9')
def ingest_synthetic_data(output_dataset: dsl.Output[dsl.Dataset]):
    """Generates synthetic regulatory compliance data."""
    import json
    import random
    
    data = []
    industries = ['Finance', 'Healthcare', 'Energy', 'Retail']
    
    for _ in range(100):
        item = {
            'industry': random.choice(industries),
            'compliance_score': random.uniform(0, 10),
            'risk_level': random.choice(['Low', 'Medium', 'High']),
            'regulatory_body': 'Global Compliance Authority'
        }
        data.append(item)
        
    with open(output_dataset.path, 'w') as f:
        json.dump(data, f)
        
    print(f"Generated {len(data)} synthetic records.")

@dsl.component(base_image='python:3.9', packages_to_install=['scikit-learn', 'pandas'])
def train_model(input_dataset: dsl.Input[dsl.Dataset], model: dsl.Output[dsl.Model]):
    """Trains a simple predictive model."""
    import json
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier
    import pickle
    
    with open(input_dataset.path, 'r') as f:
        data = json.load(f)
        
    df = pd.DataFrame(data)
    
    # Simple feature engineering
    df['industry_code'] = df['industry'].astype('category').cat.codes
    
    X = df[['industry_code', 'compliance_score']]
    y = df['risk_level']
    
    clf = RandomForestClassifier(n_estimators=10)
    clf.fit(X, y)
    
    # Save model
    with open(model.path, 'wb') as f:
        pickle.dump(clf, f)
        
    print("Model trained successfully.")

@dsl.component(base_image='python:3.9')
def validate_model(model: dsl.Input[dsl.Model]) -> bool:
    """Validates the model (Mock validation)."""
    import pickle
    
    # In a real scenario, we would load test data and evaluate metrics
    print("Validating model...")
    return True

@dsl.component(base_image='python:3.9')
def deploy_model(model: dsl.Input[dsl.Model], project_id: str, region: str):
    """Deploys the model to Cloud Run (Mock deployment)."""
    print(f"Deploying model to project {project_id} in {region}...")
    print("Deployment successful (Mock).")

@dsl.pipeline(
    name='regulatory-compliance-ct-pipeline',
    description='Continuous Training pipeline for Regulatory Compliance Model'
)
def ct_pipeline(project_id: str, region: str = 'us-central1'):
    # Step 1: Ingest Data
    ingest_task = ingest_synthetic_data()
    
    # Step 2: Train Model
    train_task = train_model(input_dataset=ingest_task.outputs['output_dataset'])
    
    # Step 3: Validate Model
    validate_task = validate_model(model=train_task.outputs['model'])
    
    # Step 4: Deploy (Conditioned on validation)
    with dsl.Condition(validate_task.output == True, name='deploy-condition'):
        deploy_model(
            model=train_task.outputs['model'],
            project_id=project_id,
            region=region
        )

if __name__ == '__main__':
    compiler.Compiler().compile(
        pipeline_func=ct_pipeline,
        package_path='regulatory_compliance_pipeline.yaml'
    )
    print("Pipeline compiled to regulatory_compliance_pipeline.yaml")
